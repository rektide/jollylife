#!/usr/bin/env node

const PassThrough= require("stream").PassThrough
const Oboe = require("oboe")

function *explode(self){
  for( const i in self.compartments){
    const lines= self.compartments[ i].lines
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

function NoboClass(node, self= this){
  console.log("node", node)
  Object.assign(self, node)
  self.printClass= printClass
  self.printModule= printModule
  self.lines= self.lines|| [...explode(self)]

  if(self.members){
  }else{
    self.members= self.lines.filter( e=> e.member)
  }
  if(self.methods){
  }else{
    self.methods= self.lines.filter( e=> e.method)
  }
  console.log(self.printClass())
  return self
}
function printClass(){  
  if(!this|| !this.name){
    console.error("what am i", this)
    return
  }
  const
    memberInit= this.members.map( m=> `    this["${m.line}"]= null`).join("\n")
    methodDefs= this.methods.map( m=> `  ${m.line}{}`).join("\n")
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
  function makeNode(node, path, ancestors){
      console.log("try me", path, JSON.stringify(node, null, "\t"))
      if( node.type!== "CLASS"){
        return
      }
      return new NoboClass(node)
  }
  //function printPath(...arg){
  //  classCursor.push({})
  //  console.log(" printPath", arg)
  //}
 
  let res
  const done= new Promise( r=> res= val=> r(val))
  const gmafb= new PassThrough()
  gmafb.end(Buffer.from(JSON.stringify(nomnoml)))
  const run= Oboe(gmafb)
    //.on("path", "*", printPath)
    //.on("path", "nodes.*", printPath)
    .on("node", "nodes.*", makeNode)
    //.on("path", "nodes.*.compartments.*.nodes", printPath)
    .on("node", "nodes.*.compartments.*.nodes", makeNode)
    .on("fail", fml=> console.error({fml}))
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
