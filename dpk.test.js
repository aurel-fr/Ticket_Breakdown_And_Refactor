const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });
  it("Returns the literal '0' when given a falsy input", () => {
    const falsy = [0, false, null, undefined, "", NaN];
    for (const f of falsy) {
      const trivialKey = deterministicPartitionKey(f);
      expect(trivialKey).toBe("0");
    }
  });
  it("Returns a sha3-512 hash when given a string input that is not flagged as a partition key", () => {
    const key = "donald_duck";
    const expectedHash =
      "59f1e0700f81b70c8593bf4921a0ecacbd232e4e9df8f56b507049fc79c837d1f123a8af735a48ebd2c048179964ab78687967c02fe529b8176b7b7c6f5002a0";
    const hash = deterministicPartitionKey(key);
    expect(hash).toBe(expectedHash);
    // The sha3-512 hash function will produce a 512 bits hash. 512 bits is 64 bytes.
    // hex encoding is 2 chars for 1 byte so expected string length is 2*64 = 128
    expect(hash).toHaveLength(128);
    // check we do have a hex string
    // who doesn't love regex
    expect(hash).toMatch(/^(0x|0h)?[0-9A-F]+$/i);
  });
  it("Returns a sha3-512 hash when given an input that is not a string and not flagged as a partition key", () => {
    const key = { badKey: 998 };
    const expectedHash =
      "dd54f7808ee0bd4a39f1d71913a2b86fbb4eafb34cb9a9764dda8cfbc9eb5001f19327cbd6eba21bf4873737c89bf4ece24a301dc27cdfbc0bd304c75f55be55";
    const hash = deterministicPartitionKey(key);
    expect(hash).toBe(expectedHash);
    expect(hash).toHaveLength(128);
    expect(hash).toMatch(/^(0x|0h)?[0-9A-F]+$/i);
  });
  it("Returns a hash when the partition key is falsy", () => {
    const falsy = [0, false, null, undefined, "", NaN];
    for (const f of falsy) {
      const hash = deterministicPartitionKey({ partitionKey: f });
      expect(hash).toHaveLength(128);
      expect(hash).toMatch(/^(0x|0h)?[0-9A-F]+$/i);
    }
  });
  it("Returns a deterministic hash for a given input", () => {
    const key = "";
    // sha3-512 hash of "{"partitionKey":""}"
    const expectedHash =
      "b7478342a465088fc33d43a64cd370737e5a3bf6749ca62c1d6db341beb987326b4df3a9f54f67a2f0ee915d4216af2f382fda14dd58dc67794f745e92d7a7f6";
    const hash = deterministicPartitionKey({ partitionKey: key });
    expect(hash).toBe(expectedHash);
    expect(hash).toHaveLength(128);
    expect(hash).toMatch(/^(0x|0h)?[0-9A-F]+$/i);
  });
  it("Returns a partition key unchanged when given a partition key string less than 257 chars", () => {
    const key = "1".repeat(256);
    const resultingKey = deterministicPartitionKey({ partitionKey: key });
    expect(resultingKey).toBe(key);
  });
  it("Returns a stringified partition key when it is not a string but truthy and its string representation is less than 257 chars", () => {
    const truthy = [{ badKey: 998 }, true, 1, []];
    for (const t of truthy) {
      const resultingKey = deterministicPartitionKey({ partitionKey: t });
      expect(resultingKey).toBe(JSON.stringify(t));
    }
  });
  it("Returns the sha3-512 hash of a partition key when it is a string over 256 chars", () => {
    const key = "1".repeat(257);
    const expectedHash =
      "3f2e417dd3287bb9d5a0e47a8a25191210abdd7739d882cea800f3180dc91508c047c737c51abad48d4d4f2469776294e2b4d9de0af65bffb147d7655ff49fa8";
    const hash = deterministicPartitionKey({ partitionKey: key });
    expect(hash).toBe(expectedHash);
    expect(hash).toHaveLength(128);
    expect(hash).toMatch(/^(0x|0h)?[0-9A-F]+$/i);
  });
  it("Returns the sha3-512 hash of a partition key when it is not a string but whose string representation is over 256 chars", () => {
    const key = Array.from({ length: 500 }, (val, i) => i);
    const expectedHash =
      "36b30641bf19f6005847c5411a3fc57b68da205b64c443f9f448aa758d1fec1f318022ec0431c1768592a6b28fc9422ddac59e9c77ef381172c7eb1833fe8abd";
    const hash = deterministicPartitionKey({ partitionKey: key });
    expect(hash).toBe(expectedHash);
    expect(hash).toHaveLength(128);
    expect(hash).toMatch(/^(0x|0h)?[0-9A-F]+$/i);
  });
});
