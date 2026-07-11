const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

console.log('[Mock DB] Mongoose Mock Database active for testing.');

// Override connect
mongoose.connect = function() {
  console.log('[Mock DB] Mock MongoDB connected successfully');
  mongoose.connection.readyState = 1; // Connected
  setTimeout(() => {
    mongoose.connection.emit('connected');
  }, 10);
  return Promise.resolve();
};

const store = {
  User: [
    {
      _id: '507f1f77bcf86cd799439011',
      fullName: 'Zazele Admin',
      email: 'admin@zazele.com',
      passwordHash: bcrypt.hashSync('CHANGE_ME_IMMEDIATELY_IN_PROD', 10),
      role: 'admin',
      approved: true,
      country: 'South Africa',
      province: 'Gauteng',
      contactNumber: '0821234567'
    },
    {
      _id: '507f1f77bcf86cd799439012',
      fullName: 'Zazele Student',
      email: 'student@zazele.com',
      passwordHash: bcrypt.hashSync('student123', 10),
      role: 'student',
      approved: true,
      country: 'South Africa',
      province: 'Western Cape',
      contactNumber: '0837654321'
    }
  ],
  Module: [
    { _id: '507f1f77bcf86cd799439021', title: 'Module 1: Introduction', description: 'Intro module', code: 'M1', order: 1 }
  ],
  Lesson: [
    { _id: '507f1f77bcf86cd799439031', moduleId: '507f1f77bcf86cd799439021', title: 'Lesson 1.1', content: 'Basic Lesson', order: 1 }
  ],
  Assignment: [],
  AssignmentQuestion: [],
  Event: [
    { _id: '507f1f77bcf86cd799439041', title: 'Orientation Webinar', description: 'Welcome', date: new Date(Date.now() + 86400000).toISOString(), link: 'https://zoom.us' }
  ],
  EventRegistration: [],
  Notification: [],
  ProfileUpdateRequest: [],
  StudentProgress: [],
  SupportRequest: []
};

// Custom query class matching Mongoose query interface
class MockQuery {
  constructor(modelName, result) {
    this.modelName = modelName;
    this.result = result;
  }
  exec() {
    if (global.mockDbFail) {
      return Promise.reject(new Error('Mongoose connection timeout simulating DB failure'));
    }
    return Promise.resolve(this.result);
  }
  then(resolve, reject) {
    if (global.mockDbFail) {
      return Promise.reject(new Error('Mongoose connection timeout simulating DB failure')).then(resolve, reject);
    }
    return Promise.resolve(this.result).then(resolve, reject);
  }
  catch(reject) {
    if (global.mockDbFail) {
      return Promise.reject(new Error('Mongoose connection timeout simulating DB failure')).catch(reject);
    }
    return Promise.resolve(this.result).catch(reject);
  }
  select() { return this; }
  populate() { return this; }
  sort() { return this; }
  limit() { return this; }
  skip() { return this; }
}

// Convert plain objects to mongoose documents
function toDoc(modelName, data) {
  if (!data) return null;
  if (Array.isArray(data)) {
    return data.map(item => toDoc(modelName, item));
  }
  const Model = mongoose.models[modelName];
  if (!Model) return data;
  const doc = new Model(data);
  // Ensure save can be called
  doc.save = function() {
    const list = store[modelName] || [];
    const idx = list.findIndex(x => x._id.toString() === this._id.toString());
    if (idx >= 0) {
      list[idx] = this.toObject();
    } else {
      list.push(this.toObject());
    }
    return Promise.resolve(this);
  };
  return doc;
}

// Patch Model methods
const Model = mongoose.Model;

Model.find = function(conditions = {}) {
  const modelName = this.modelName;
  let list = store[modelName] || [];
  if (conditions._id) {
    list = list.filter(x => x._id.toString() === conditions._id.toString());
  }
  if (conditions.email) {
    list = list.filter(x => x.email === conditions.email);
  }
  if (conditions.role) {
    list = list.filter(x => x.role === conditions.role);
  }
  return new MockQuery(modelName, toDoc(modelName, list));
};

Model.findOne = function(conditions = {}) {
  const modelName = this.modelName;
  const list = store[modelName] || [];
  let found = null;
  if (conditions.email) {
    found = list.find(x => x.email === conditions.email);
  } else if (conditions.resetPasswordToken) {
    found = list.find(x => x.resetPasswordToken === conditions.resetPasswordToken);
  } else if (conditions._id) {
    found = list.find(x => x._id.toString() === conditions._id.toString());
  } else {
    found = list[0] || null;
  }
  return new MockQuery(modelName, toDoc(modelName, found));
};

Model.findById = function(id) {
  const modelName = this.modelName;
  const list = store[modelName] || [];
  const found = list.find(x => x._id.toString() === id.toString());
  return new MockQuery(modelName, toDoc(modelName, found));
};

Model.findByIdAndUpdate = function(id, update, options = {}) {
  const modelName = this.modelName;
  const list = store[modelName] || [];
  const idx = list.findIndex(x => x._id.toString() === id.toString());
  if (idx >= 0) {
    const updated = { ...list[idx], ...update };
    list[idx] = updated;
    return new MockQuery(modelName, toDoc(modelName, updated));
  }
  return new MockQuery(modelName, null);
};

Model.countDocuments = function(conditions = {}) {
  const modelName = this.modelName;
  const list = store[modelName] || [];
  return new MockQuery(modelName, list.length);
};

Model.create = function(data) {
  if (global.mockDbFail) {
    return Promise.reject(new Error('Mongoose connection timeout simulating DB failure'));
  }
  const modelName = this.modelName;
  const list = store[modelName] || [];
  const docData = Array.isArray(data) ? data : [data];
  const docs = docData.map(item => {
    const d = { _id: new mongoose.Types.ObjectId().toString(), ...item };
    list.push(d);
    return toDoc(modelName, d);
  });
  return Promise.resolve(Array.isArray(data) ? docs : docs[0]);
};

Model.insertMany = function(data) {
  if (global.mockDbFail) {
    return Promise.reject(new Error('Mongoose connection timeout simulating DB failure'));
  }
  const modelName = this.modelName;
  const list = store[modelName] || [];
  const docData = Array.isArray(data) ? data : [data];
  const docs = docData.map(item => {
    const d = { _id: new mongoose.Types.ObjectId().toString(), ...item };
    list.push(d);
    return toDoc(modelName, d);
  });
  return Promise.resolve(docs);
};

Model.deleteOne = function() { return Promise.resolve({ deletedCount: 1 }); };
Model.deleteMany = function() { return Promise.resolve({ deletedCount: 1 }); };
Model.updateOne = function() { return Promise.resolve({ nModified: 1 }); };
Model.updateMany = function() { return Promise.resolve({ nModified: 1 }); };

// Override Model save globally to mock storage
mongoose.Model.prototype.save = async function() {
  if (global.mockDbFail) {
    return Promise.reject(new Error('Mongoose connection timeout simulating DB failure'));
  }
  const modelName = this.constructor.modelName;
  
  if (modelName === 'User' && this.isModified && this.isModified('passwordHash')) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  
  const list = store[modelName] || [];
  const idx = list.findIndex(x => x._id.toString() === this._id.toString());
  if (idx >= 0) {
    list[idx] = this.toObject();
  } else {
    list.push(this.toObject());
  }
  return this;
};
