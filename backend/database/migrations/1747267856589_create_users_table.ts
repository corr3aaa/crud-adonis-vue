import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()

      // Novos campos adicionados
      table.enum('role', ['user', 'admin']).notNullable().defaultTo('user')
      table.string('street').nullable()
      table.string('city').nullable()
      table.string('state').nullable()
      table.string('zip_code').nullable()
      table.string('country').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
