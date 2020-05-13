
const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    content: {
      type: String,
      required: true },
    blogId : {
        type: String,
      required: true 
    }
  })

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })


module.exports = mongoose.model('Comment', blogSchema)
