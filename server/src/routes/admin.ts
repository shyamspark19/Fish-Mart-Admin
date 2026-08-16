import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { authorizeRoles } from '../middleware/roles'

const router = Router()

router.get('/stats', authenticate, authorizeRoles('ADMIN'), async (req, res) => {
  // Placeholder: return minimal stats. Real implementation should query DB.
  return res.json({ todaysOrders: 0, todaysRevenue: 0, pendingOrders: 0 })
})

export default router
