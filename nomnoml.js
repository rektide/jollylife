function main(){
  const nomnoml = require("nomnoml")
  const {parse} = nomnoml
  const source = require("./render-svg.js")
  //console.log("keys", Object.keys(nomnoml))
  const parsed = parse(source)
  //console.log(JSON.stringify(parsed, null, "\t"))
  return parsed
}

if (require.main === module) {
  console.log(JSON.stringify(main(), null, "\t"))
}

module.exports= main