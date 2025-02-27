const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const userSchema = mongoose.Schema({
    name: {type:String, require:true},
    surename:{type:String, require:true},
    email:{type:String, require:true, unique: true},
    password:{type:String, require:true}
})
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  })
module.exports = mongoose.model('User',userSchema)