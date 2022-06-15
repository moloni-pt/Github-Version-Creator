import { info } from "@actions/core";

export default (): string => {
  const ref = process.env.GITHUB_REF;
  info(`Reference push: ${ref}`);

  if (ref && ref.startsWith("refs/tags/")) {
    const tag = ref.replace(/^refs\/tags\//, "");
    info(`Found release Tag: ${tag}`);
    return tag;
  } else {
    info(`Release tag not found`);
    return "";
  }
}
