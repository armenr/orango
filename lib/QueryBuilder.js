class QueryBuilder {
  constructor(query = {}) {
    this._query = query
  }

  name(val) {
    this._query.name = val
    return this
  }

  byId(id) {
    this.where({
      _key: id + ''
    })
    this.one()
    return this
  }

  where(val) {
    this._query.where = val
    return this
  }

  offset(val = 0) {
    this._query.offset = val
    return this
  }

  limit(val = 10) {
    this._query.limit = val
    return this
  }

  one(val = true) {
    this._query.one = val
    return this
  }

  withDefaults(val = true) {
    this._query.withDefaults = val
    return this
  }

  let(key, value) {
    if (!this._query.lets) {
      this._query.lets = {}
    }
    this._query.lets[key] = value
    return this
  }

  select(val = '') {
    if (val) {
      this._query.select = val
    } else {
      delete this._query.select
    }
    return this
  }

  query(...opts) {
    if (!this._query.queries) {
      this._query.queries = []
    }
    if (typeof opts[0] === 'string') {
      this._query.queries.push({
        let: opts[0],
        query: opts[1].toJSON()
      })
    } else {
      this._query.queries.push({
        query: opts[0].toJSON()
      })
    }
    return this
  }

  return(val = true) {
    this._query.return = val
    return this
  }

  toJSON() {
    let returnOptions = this._query.return
    const q = Object.assign({}, this._query, {
      return: returnOptions
    })
    return JSON.parse(JSON.stringify(q))
  }

  async toAQL(formatted = false) {
    if (!this.orango) {
      throw new Error('Orango instance required')
    }
    let json = this.toJSON()
    let aql = await this.orango.queryToAQL(json, formatted)
    return aql
  }

  async then(resolve, reject) {
    let orango = this.orango
    let aql = await orango.queryToAQL(this)
    try {
      let cursor = await orango.connection.db.query(aql)
      let result = await cursor.next()
      return resolve(result)
    } catch (e) {
      return reject(e)
    }
  }
}

module.exports = QueryBuilder