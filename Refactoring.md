# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

This function has 3 types of input:

- Falsy input. In that case the trivial partition key is returned.
- An input containing a truthy partition key. If that partition key is considered valid ( must be a string <= 256 chars ) it is returned as is. Else the partition key is stringified and is either returned as is if the result is <= 256 chars long or its hash is returned.
- An input that is not flagged as a partition key or is a falsy partition key. The input is stringified and its hash is returned.

Immediately returning the trivial partition key if the input is falsy lets us deal with 1 out of the 3 possible inputs right away. 
For the 2 other possible types of input an if else statement checks whether it is a truthy partition key or not, and appropriately deals with each scenario.

Organizing that function in a way that highlights the 3 types of input it can receive provides clarity, and makes it easy to write tests as well.

