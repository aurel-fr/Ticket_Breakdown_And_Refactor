const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  // falsy input -> return trivial partition key
  if (!event) return TRIVIAL_PARTITION_KEY;

  let { partitionKey } = event
  // check if the event includes a truthy partition key
  if (partitionKey) {
    // if the partition key is not a string stringify it
    if (typeof partitionKey != "string") partitionKey = JSON.stringify(partitionKey);
    // if the partition key string is below acceptable length return as is
    if (partitionKey.length <= MAX_PARTITION_KEY_LENGTH) return partitionKey;
  } else {
    // if no partition key or a falsy partition key is provided stringify the input
    partitionKey = JSON.stringify(event);
  }
  return crypto.createHash("sha3-512").update(partitionKey).digest("hex");
};
