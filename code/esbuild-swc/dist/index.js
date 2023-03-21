(() => {
  // add.ts
  var add = function (a2, b2) {
    return a2 + b2;
  };
  var add_default = add;

  // index.ts
  var a = 1;
  var b = "corner";
  var res = add_default(1, 2);
  console.log(res);
})();
