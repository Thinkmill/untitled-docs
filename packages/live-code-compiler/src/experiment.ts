// I might want to come back to this
// function useCompiledResult(
//   code: string,
//   initialResult: (() => BabelResult) | null
// ): { latest: BabelResult | null; lastestSafe: SuccessBabelResult | null } {
//   let [transformedResult, setTransformedResult] = useState<{
//     latest: BabelResult | null;
//     lastestSafe: SuccessBabelResult | null;
//   }>(() => {
//     if (initialResult !== null) {
//       let readInitialResult = initialResult();
//       if (readInitialResult.status !== "success") {
//         throw new Error(
//           `There was a parse error with a live code example.\n${
//             readInitialResult.status === "parse-error"
//               ? readInitialResult.rawMessage
//               : readInitialResult.message
//           }\n\n\`\`\`\n${code.trim()}\n\`\`\``
//         );
//       }
//       return {
//         lastestSafe: readInitialResult,
//         latest: readInitialResult,
//       };
//     }
//     return {
//       lastestSafe: null,
//       latest: null,
//     };
//   });
//   useEffect(() => {
//     let shouldSet = true;
//     worker!.compile(code).then((result) => {
//       if (shouldSet) {
//         setTransformedResult((prevState) => {
//           return {
//             latest: result,
//             lastestSafe:
//               result.status === "success" ? result : prevState.lastestSafe,
//           };
//         });
//       }
//     });
//     return () => {
//       shouldSet = false;
//     };
//   }, [code]);
//   return transformedResult;
// }
export {};
