export const spacesAboutInfoExcel = async () => {
  console.log("Demonstrate running of a file of type 'module'");
};

const main = async () => {
  await spacesAboutInfoExcel();
};

main().catch(error => {
  console.error(error);
});
