var nomnoml = require('nomnoml')
var fs = require('fs')

// Prox.make(x) returns something like x, but hidden behind prox

var source = `#lineWidth: 3

[_reflect]

[pipelineNames]

[PhasedMiddleware]

[ProxClass
|
  make(obj={}, opts)
|
]

[Prox
|
  constructor(obj, { pipelines, middlewares, name }= defaults)
|
  proxied
]

[stripHandlerSuffix]

[ProxClass] -- [Prox]
[Prox] -:> [PhasedMiddleware]

[context
|
setOutput(output)
|
inputs;
output;
state;
phasedMiddleware;
phasedRun;
pipelineName;
position;
plugin;
handler;
symbol
]


[plugin
|
handle(context : Context)
]

[phase] <:- [red]
[phase] <:- [green]
[phase] <:- [yellow]

[phase] <:- [walk]
[phase] <:- [blinking]
[phase] <:- [dontWalk]

[pipeline] <:- [leftTurnLane]
[pipeline] <:- [straightAhead]
[pipeline] <:- [crosswalk]
[pipeline] <:- [get]
[pipeline] <:- [set]

[Pirate|eyeCount: Int|raid();pillage()|
  [beard]--[parrot]
  [beard]-:>[foul mouth]
]
[<abstract>Marauder]<:--[Pirate]
[Pirate]- 0..7[mischief]
[jollyness]->[Pirate]
[jollyness]->[rum]
[jollyness]->[singing]
[Pirate]-> *[rum|tastiness: Int|swig()]
[Pirate]->[singing]
[singing]<->[rum]
[<start>st]->[<state>plunder]
[plunder]->[<choice>more loot]
[more loot]->[st]
[more loot] no ->[<end>e]
[<actor>Sailor] - [<usecase>shiver me;timbers]

`;

if (require.main === module){
  fs.writeFileSync('/app/public/output.node-test.svg', nomnoml.renderSvg(source), 'utf8')
}
module.exports = source