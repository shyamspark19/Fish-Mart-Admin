import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { authorizeRoles } from '../middleware/roles'
import { createProduct, updateProduct, deleteProduct } from '../controllers/adminProductController'

const router = Router()

router.use(authenticate, authorizeRoles('ADMIN'))
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router
