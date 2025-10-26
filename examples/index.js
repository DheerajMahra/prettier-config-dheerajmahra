function sayHello(name) {
  console.log("Hello, " + name + "!")
}

sayHello("Dheeraj");

const numbers = [1, 2, 3, 4, 5]

numbers.forEach(num => {
  if (num % 2 === 0) {
    console.log(num + " is even")
  } else {
    console.log(num + " is odd");
  }
});
