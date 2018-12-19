#!/usr/bin/env node

const PassThrough= require("stream").PassThrough
const Oboe = require("oboe")

function *explode(compartments){
  for( const i in compartments){
    const lines= compartments[ i].lines
    for( const j in lines){
      const
        line= lines[ j],
        isMethod= line[ line.length- 1]=== ")" && line[ line.length- 2]=== "("
        method= isMethod? line.substring( 0, line.length- 2): undefined
        member= isMethod? undefined: line
      yield {
        line,
        member,
        method
      }
    }
  }
}

function NoboClass(node, self){
  Object.assign(self, node)
  self.printClass= printClass
  self.printModule= printModule
  self.lines= self.lines|| []
  const [...exploded]= explode(self)

  if(self.members){
  }else if(self.lines.length){
    self.members= exploded.filter( e=> e.member)
  }
  if(!self.members){
    self.members= []
  }
  if(self.methods){
  }else if(self.lines.length){
    self.methods= exploded.filter( e=> e.methods)
  }
  if(!self.methods){
    self.methods= []
  }
  console.log("ax")
  console.log(self.printClass())
  return self
}
function printClass(){  
  if(!this|| !this.name){
    console.error("what am i", this)
    return
  }
  const
    memberInit= this.members.map( m=> `  this["${m}"]= null`).join("\n")
    methodDefs= this.methods.map( m=> `  ${m}(){}`).join("\n")
  return `
class ${this.name}{ 
  constructor(){
    ${"\n"+memberInit}
  }
${methodDefs}
}
`
}
function printModule(){
  return "export default "+ this.printClass()
}

const classCursor= []

function classGen(nomnoml){
  function makeNode(node){
      console.log("try me", JSON.stringify(node, null, "\t"))
      if( node.type!== "CLASS"){
        return
      }
      const popped= classCursor[ classCursor.length- 1]
      classCursor.pop()
      return NoboClass(node, popped)
  }
  function printPath(...arg){
    classCursor.push({})
    console.log(" printPath", arg)
  }
 
  let res
  const done= new Promise( r=> res= val=> r(val))
  const gmafb= new PassThrough()
  gmafb.end(Buffer.from(JSON.stringify(nomnoml)))
  const run= Oboe(gmafb)
    //.on("path", "*", printPath)
    .on("path", "nodes.*", printPath)
    .on("node", "nodes.*", makeNode)
    .on("path", "nodes.*.compartments.*.nodes", printPath)
    .on("node", "nodes.*.compartments.*.nodes", makeNode)
    .on("done", res)
  return done
}

function main( nomnoml= require("./nomnoml")()){
  return classGen(nomnoml)
}

if(require.main=== module){
  main()
  //.then(main => console.log("!", JSON.stringify(main, null, "\t")))
}

//process.on("uncaughtException", console.error)
//process.on("unhandledRejection", console.error)
