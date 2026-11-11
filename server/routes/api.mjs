import { Router } from 'express'
import multer from 'multer'
import * as authCtrl from '../controllers/authController.mjs'
import * as contentCtrl from '../controllers/contentController.mjs'
import * as rbacCtrl from '../controllers/rbacController.mjs'
import * as storageCtrl from '../controllers/storageController.mjs'
import * as lifeGroupCtrl from '../controllers/lifeGroupController.mjs'
import * as churchMgmtCtrl from '../controllers/churchMgmtController.mjs'
import { authenticate } from '../middleware/auth.mjs'
import { requirePermission } from '../middleware/rbac.mjs'
import { realtimeConfigured } from '../services/realtimeService.mjs'
import { storageConfigured } from '../services/storageService.mjs'
import { config } from '../config.mjs'

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })
export const apiRouter = Router()

apiRouter.get('/health', (_req, res) => {
  res.json({
    ok: true,
    services: {
      postgres: Boolean(config.databaseUrl),
      objectStorage: storageConfigured(),
      realtime: realtimeConfigured(),
    },
  })
})

apiRouter.post('/auth/login', authCtrl.login)
apiRouter.get('/auth/me', authenticate, authCtrl.me)

apiRouter.get('/church', contentCtrl.churchInfo)
apiRouter.get('/feed', contentCtrl.listFeed)
apiRouter.get('/feed/live', contentCtrl.feedLiveToken)
apiRouter.get('/events', contentCtrl.listEvents)
apiRouter.get('/menu', contentCtrl.listMenu)
apiRouter.get('/home/summary', churchMgmtCtrl.homeSummary)
apiRouter.get('/locations', churchMgmtCtrl.listLocations)
apiRouter.get('/sermons', churchMgmtCtrl.listSermons)
apiRouter.get('/life-groups/public', lifeGroupCtrl.listPublic)
apiRouter.post('/life-groups/signup', lifeGroupCtrl.createSignup)

const gestao = Router()
gestao.use(authenticate, requirePermission('lifegroup.manage'))
gestao.get('/life-groups', lifeGroupCtrl.listGroupsAdmin)
gestao.post('/life-groups', lifeGroupCtrl.createGroup)
gestao.put('/life-groups/:id', lifeGroupCtrl.updateGroup)
gestao.delete('/life-groups/:id', lifeGroupCtrl.deleteGroup)
gestao.get('/signups', lifeGroupCtrl.listSignups)
gestao.patch('/signups/:id', lifeGroupCtrl.updateSignup)
gestao.get('/reports', lifeGroupCtrl.listReports)
gestao.post('/reports', lifeGroupCtrl.createReport)
gestao.get('/locations', churchMgmtCtrl.listLocationsAdmin)
gestao.post('/locations', churchMgmtCtrl.upsertLocation)

apiRouter.use('/gestao', gestao)

apiRouter.get('/storage/health', storageCtrl.storageHealth)
apiRouter.post(
  '/storage/upload',
  authenticate,
  requirePermission('storage.write'),
  upload.single('file'),
  storageCtrl.uploadAsset,
)

const admin = Router()
admin.use(authenticate, requirePermission('rbac.manage'))

const entities = ['roles', 'permissions', 'functions']
for (const entity of entities) {
  admin.get(`/${entity}`, (req, res, next) => {
    req.params.entity = entity
    rbacCtrl.listEntity(req, res).catch(next)
  })
  admin.post(`/${entity}`, (req, res, next) => {
    req.params.entity = entity
    rbacCtrl.createEntity(req, res).catch(next)
  })
  admin.put(`/${entity}/:id`, (req, res, next) => {
    req.params.entity = entity
    rbacCtrl.updateEntity(req, res).catch(next)
  })
  admin.delete(`/${entity}/:id`, (req, res, next) => {
    req.params.entity = entity
    rbacCtrl.deleteEntity(req, res).catch(next)
  })
}
admin.get('/users', rbacCtrl.listUsers)

apiRouter.use('/admin', admin)
