import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {

    async index({ request, response }: HttpContext) {
        const search = request.input('search', '').trim()
        const sortBy = request.input('sortBy', 'id')
        const sortOrder = request.input('sortOrder', 'asc')

        let query = User.query()

        if (search.length > 0) {
            query = query.where('fullName', 'like', `%${search}%`)
        }

        const allowedSortFields = ['id', 'fullName', 'email', 'role', 'city', 'state']
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'id'
        const sortDirection = sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc'

        const users = await query.orderBy(sortField, sortDirection)
        return response.ok(users)
    }

    async store({ request, response }: HttpContext) {
        const data = request.only([
            'fullName',
            'email',
            'password',
            'role',
            'street',
            'city',
            'state',
            'zipCode',
            'country',
        ])

        const user = await User.create(data)
        return response.created(user)
    }

    async show({ params, response }: HttpContext) {
        const user = await User.find(params.id)
        if (!user) {
            return response.notFound({ message: 'User not found' })
        }
        return response.ok(user)
    }

    async update({ params, request, response }: HttpContext) {
        const user = await User.find(params.id)
        if (!user) {
            return response.notFound({ message: 'User not found' })
        }

        const data = request.only([
            'fullName',
            'email',
            'password',
            'role',
            'street',
            'city',
            'state',
            'zipCode',
            'country',
        ])

        user.merge(data)
        await user.save()

        return response.ok(user)
    }

    async destroy({ params, response }: HttpContext) {
        const user = await User.find(params.id)
        if (!user) {
            return response.notFound({ message: 'User not found' })
        }

        await user.delete()
        return response.ok({ message: 'User deleted successfully' })
    }
}
