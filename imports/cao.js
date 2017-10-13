const __cao__ = new Mongo.Collection('__cao__')

const cao = {}

cao.collection = __cao__

cao.init = function () {
  if (! Package['accounts-password'])
    return console.log('cao has to be used accounts-password to work')

  if (Meteor.isClient) {
    Meteor.subscribe('__cao__')
    if (Meteor.isDevelopment)
      console.log('subscribe cao')
  }

  if (Meteor.isServer) {
    __cao__._ensureIndex('userId', { unique: 1 })

    Meteor.publish('__cao__', function () {
      if (! this.userId) return this.ready()

      const isExist = __cao__.findOne({ userId: this.userId })

      if (! isExist)
        __cao__.insert({ userId: this.userId })

      return __cao__.find({ userId: this.userId })
    })
  }

  Meteor.methods({
    'cao.set'(k, v) {
      const isExist = __cao__.findOne({ userId: this.userId })
      if (isExist && isExist.userId === this.userId) {
        __cao__.update({ userId: Meteor.userId() }, { $set: { [k]: v } })
      }
    },
  })
}

cao.autorun = function (fn) {
  if (Meteor.isClient)
    return console.log('cao autorun is server only')

  const ctx = DDP._CurrentPublicationInvocation.get()

  const cursor = __cao__.find({ userId: ctx.userId })

  const observeHandler = cursor.observe({
    changed(current, previous) {
      console.log('rerun')
      fn(current, previous)
    }
  })

  return observeHandler
}

cao.set = function (k, v) {
  Meteor.call('cao.set', k, v)
}

export default cao
