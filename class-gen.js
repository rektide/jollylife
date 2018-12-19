#!/usr/bin/env node
"uses strict"

const PassThrough= require("stream").PassThrough
const Oboe = require("oboe")

function *explode(self){
  for( const i in self.compartments){
    const lines= self.compartments[ i].lines
    for( const j in lines){
      const
        line= lines[ j],
        isMethod= line[ line.length- 1]=== ")" && line[ line.length- 2]=== "(",
        method= isMethod? line.substring( 0, line.length- 2): undefined,
        typedMember= !isMethod? line.indexOf(":"): -1,
        memberName= typedMember!== -1? line.substring( 0, typedMember): line,
        memberType= typedMember!== -1? line.substring( typedMember+ 2): undefined,
        member= !isMethod ? memberName: undefined
      yield {
        line,
        member,
        method,
        memberType
      }
    }
  }
}

function NoboClass(node, self= this){
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
    memberInit= this.members.map( m=> `    this["${m.member}"]= null`).join("\n"),
    memberFlow= this.members.filter( m=> m.memberType).map( m=> `  /*:: ${m.member}: ${m.memberType}; */`).join("\n"),
    methodDefs= this.methods.map( m=> `  ${m.line}{}`).join("\n")
  return `
class ${this.name}{ 
  constructor(){
${memberInit}
  }
${memberFlow}
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
      if( node.type!== "CLASS"){
        return
      }
      return new NoboClass(node)
  }
 
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
