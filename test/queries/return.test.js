describe('return query', async () => {

  let orango, Model

  beforeAll(async () => {
    orango = require('../../lib')
    Model = orango.model()
  })

  /*
    orango.return(append([1, 2, 3], [3, 4, 5], true))
    let results = orango
      .series(append([1, 2, 3], [3, 4, 5], true))
      .series(append([1, 2, 3], [3, 4, 5], true))
      .series(append([1, 2, 3], [3, 4, 5], true))
      .exec()
    results = [[ 1, 2, 3, 4, 5 ], [ 1, 2, 3, 4, 5 ], [ 1, 2, 3, 4, 5 ]]

    Model.query()
  */

  test('Model.return()', async () => {
    const { append } = orango.funcs
    let query = Model.return(append([1, 2, 3], [3, 4, 5], true))
    
    let aql = await query.toAQL()
    expect(aql).toBe('LET result = APPEND([1,2,3],[3,4,5],true) RETURN result')
  })
  
})