/* Singleton Pattern */
function Singleton(name) {
  this.name = name
}

Singleton.instance = null

Singleton.getInstance = function () {
  if (!this.instance) {
    Singleton.instance = new Singleton(arguments)
  }
  return Singleton.instance
}

// const a = new Singleton('Json')
// const b = new Singleton('Joke')

const a = Singleton.getInstance('Json')
const b = Singleton.getInstance('Joke')
console.log(a === b);
