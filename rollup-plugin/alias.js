function alias(options) {
  return {
    name: "alias",
    resolveId(source, importer) {
      if (!importer) {
        return null;
      }
      const { replacement } =
        options.find((option) => source.startsWith(option.find)) ?? {};
      if (!replacement) {
        return null;
      }
      return this.resolve(replacement, importer).then(
        (resolved) => resolved || { id: replacement }
      );
    },
  };
}

export default alias;
