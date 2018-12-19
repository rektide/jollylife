const oboe = require("oboe")

function *explode(comparments){
  for( const i in comparments){
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
  Object.setPrototypeOf(self, NoboClass)
  Object.assign(self, node)
  self.lines= self.lines|| []
  const [...exploded]= explode(self)

  if(self.members){
  }else if(self.lines.length){
    self.members= exploded.filter( e=> e.member)
  }
  if(self.methods){
  }else if(self.lines.length){
    self.methods= exploded.filter( e=> e.methods)
  }
  return self
}
NoboClass.prototype.printClass= function(){  
  const
    memberInit= this.members.forEach( m=> `  this["${m}"]= null`)
    methodDefs= this.methods.forEach( m=> `  ${m}(){}`)
  return `
class ${this.name}{ 
  constructor(){
    ${"\n"+memberInit.join("\n")}
  }
${methodDefs}
}
`
}
NoboClass.prototype.printModule= function(){
  return "export default "+ this.printClass()
}

const classCursor= []

function classGen(nomnoml){
  function makeNode(){
      if( node.type!== "CLASS"){
        return
      }
      console.log(" mknode", popped.name)
      const popped= classCursor[ classCursor.length- 1]
      classCursor.pop()
      return NoboClass(node, popped)
  }
  function printPath(arg){
    classCursor.push({})
    console.log(" printPath", arg)
  }
 
  let res
  function mkRes( r){
    res= function(val){
      console.log(val)
      r(val)
    }
  }
  const done= new Promise( r=> res= val=> {
	console.log(" done", val),
     r(val)
    })
  oboe({ body: nomnoml})
    .on("path", "*", printPath)
    .on("path", "nodes.*", printPath)
    .on("node", "nodes.*", makeNode)
    .on("path", "nodes.*compartments.*.nodes", printPath)
    .on("node", "nodes.*compartments.*.nodes", makeNode)
    .on("done", d=> {
      console.log("fin", d)
      res(d)
    })
  console.log("done1", done)
  done.then(x=> console.log("done2", x))
  return done
}

function main( nomnoml= require("./nomnoml")()){
  return classGen(nomnoml)
}

if(require.main=== module){
  main().then(main => console.log(JSON.toString(main, null, "\t")))
}
