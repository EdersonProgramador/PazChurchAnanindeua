import { Router } from 'express'
import multer from 'multer'
import * as authCtrl from '../controllers/authController.mjs'
import * as contentCtrl from '../controllers/contentController.mjs'
import * as rbacCtrl from '../controllers/rbacController.mjs'
import * as storageCtrl from '../controllers/storageController.mjs'
import * as lifeGroupCtrl from '../controllers/lifeGroupController.mjs'
import * as churchMgmtCtrl from '../controllers/churchMgmtController.mjs'
import * as volunteerCtrl from '../controllers/volunteerController.mjs'
import { authenticate } from '../middleware/auth.mjs'
import { requirePermission } from '../middleware/rbac.mjs'
import { requireGestao, requireContent, requireLifeGroup } from '../middleware/gestao.mjs'
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
apiRouter.get('/volunteers/ministries', volunteerCtrl.listMinistriesPublic)
apiRouter.post('/volunteers/signup', volunteerCtrl.createVolunteerSignup)

const gestao = Router()
gestao.use(authenticate, requireGestao)
gestao.get('/life-groups', requireLifeGroup, lifeGroupCtrl.listGroupsAdmin)
gestao.post('/life-groups', requireLifeGroup, lifeGroupCtrl.createGroup)
gestao.put('/life-groups/:id', requireLifeGroup, lifeGroupCtrl.updateGroup)
gestao.delete('/life-groups/:id', requireLifeGroup, lifeGroupCtrl.deleteGroup)
gestao.get('/signups', requireLifeGroup, lifeGroupCtrl.listSignups)
gestao.patch('/signups/:id', requireLifeGroup, lifeGroupCtrl.updateSignup)
gestao.get('/reports', requireLifeGroup, lifeGroupCtrl.listReports)
gestao.post('/reports', requireLifeGroup, lifeGroupCtrl.createReport)
gestao.get('/locations', requireContent, churchMgmtCtrl.listLocationsAdmin)
gestao.post('/locations', requireContent, churchMgmtCtrl.upsertLocation)
gestao.get('/events', requireContent, churchMgmtCtrl.listEventsAdmin)
gestao.post('/events', requireContent, churchMgmtCtrl.createEvent)
gestao.put('/events/:id', requireContent, churchMgmtCtrl.updateEvent)
gestao.delete('/events/:id', requireContent, churchMgmtCtrl.deleteEvent)
gestao.get('/sermons', requireContent, churchMgmtCtrl.listSermonsAdmin)
gestao.post('/sermons', requireContent, churchMgmtCtrl.createSermon)
gestao.put('/sermons/:id', requireContent, churchMgmtCtrl.updateSermon)
gestao.delete('/sermons/:id', requireContent, churchMgmtCtrl.deleteSermon)
gestao.get('/feed', requireContent, churchMgmtCtrl.listFeedAdmin)
gestao.post('/feed', requireContent, churchMgmtCtrl.createFeed)
gestao.put('/feed/:id', requireContent, churchMgmtCtrl.updateFeed)
gestao.delete('/feed/:id', requireContent, churchMgmtCtrl.deleteFeed)
gestao.get('/volunteers', requireContent, volunteerCtrl.listVolunteerSignups)
gestao.patch('/volunteers/:id', requireContent, volunteerCtrl.patchVolunteerSignup)

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
