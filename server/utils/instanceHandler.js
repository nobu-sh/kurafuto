const { ServerInstance } = require("../models/mongo")

async function add(path, name, port) {
  if (!path) return {
    created: false,
    info: "No path was defined",
  }
  if (!name) return {
    created: false,
    info: "No name was defined",
  }
  if (!port) return {
    created: false,
    info: "No port was defined",
  }
  let exist = await ServerInstance.find({ name })
  if (exist[0]) return {
    created: false,
    info: `An instance with the name "${name}" already exist`,
  }
  let newInstance = await ServerInstance.create({
    name,
    path,
    port,
  })
  await newInstance
    .save()

  return {
    created: true,
    info: newInstance,
  }
}

async function remove(name) {
  if (!name) return {
    removed: false,
    info: "No name was defined",
  }
  let exist = await ServerInstance.find({ name })
  if (!exist[0]) return {
    removed: false,
    info: `No instance with the name "${name}" exist`,
  }
  const data = await ServerInstance.deleteOne({ name })
  
  return {
    removed: true,
    data,
  }
}

async function update(name, newName, newPath, newPort) {
  if (!name) return {
    updated: false,
    info: "No name was defined",
  }
  if (!newName && !newPath && !newPort) return {
    updated: false,
    info: "No new data was defined",
  }
  let exist = await ServerInstance.find({ name })
  if (!exist[0]) return {
    removed: false,
    info: `No instance with the name "${name}" exist`,
  }
  let newData = null
  if (newName && newPath && newPort) {
    newData = { 
      path: newPath,
      name: newName,
      port: newPort,
    }
  } else if (newName && newPort && !newPath) {
    newData = {
      name: newName,
      port: newPort,
    }
  } else if (!newName && newPath && newPort) {
    newData = {
      path: newPath,
      port: newPort,
    }
  } else if (!newName && !newPath && newPort) {
    newData = {
      port: newPort,
    }
  } else if (!newName && newPath && !newPort) {
    newData = {
      path: newPath,
    } 
  } else if (newName && !newPath && !newPort) {
    newData = {
      name: newName,
    }
  }

  let update = await ServerInstance.findOneAndUpdate({ name }, { newData })
  await update
    .save()

  return {
    updated: true,
    info: update,
  }
}

async function getOne(name) {
  let one = await ServerInstance.findOne({ name })
  
  return one
}

async function getAll() {
  let all = await ServerInstance.find()
  
  return all
}

module.exports = {
  add,
  remove,
  update,
  getOne,
  getAll,
}
