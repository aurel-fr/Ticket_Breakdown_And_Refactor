const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });
  it("Returns a sha3-512 hash when given a string input that is not flagged as a partition key", () => {
    const key = "donald_duck";
    const hash = deterministicPartitionKey(key);
    expect(typeof hash).toBe("string");
    // The sha3-512 hash function will produce a 512 bits hash. 512 bits is 64 bytes.
    // hex encoding is 2 chars for 1 byte so expected string length is 2*64 = 128
    expect(hash).toHaveLength(128);
    // check we do have a hex string
    // who doesn't love regex
    expect(hash).toMatch(/^(0x|0h)?[0-9A-F]+$/i);
  });
  it("Returns a sha3-512 hash when given an input that is not a string and not flagged as a partition key", () => {
    const key = { badKey: 998 };
    const hash = deterministicPartitionKey(key);
    expect(typeof hash).toBe("string");
    expect(hash).toHaveLength(128);
    expect(hash).toMatch(/^(0x|0h)?[0-9A-F]+$/i);
  });
  it("Returns a partition key unchanged when given a partition key string less than 257 chars", () => {
    const key = "1".repeat(256);
    const resultingKey = deterministicPartitionKey({ partitionKey: key });
    expect(resultingKey).toBe(key);
  });
  it("Returns a stringified partition key when it is not a string but its string representation is less than 257 chars", () => {
    const key = { badKey: 998 };
    const resultingKey = deterministicPartitionKey({ partitionKey: key });
    expect(resultingKey).toBe(JSON.stringify(key));
  });
  it("Returns the sha3-512 hash of a partition key when it is a string over 256 chars", () => {
    const key = "1".repeat(257);
    const hash = deterministicPartitionKey({ partitionKey: key });
    expect(typeof hash).toBe("string");
    expect(hash).toHaveLength(128);
    expect(hash).toMatch(/^(0x|0h)?[0-9A-F]+$/i);
  });
  it("Returns the sha3-512 hash of a partition key when it is not a string but whose string representation is over 256 chars", () => {
    const key = Array.from({ length: 500 }, (val, i) => i);    
    const hash = deterministicPartitionKey({ partitionKey: key });
    expect(typeof hash).toBe("string");
    expect(hash).toHaveLength(128);
    expect(hash).toMatch(/^(0x|0h)?[0-9A-F]+$/i);
  });
});
