



// import { BlockRenderer } from "./BlockRenderer";

// export const ReadOnlyEditor = ({ blocks }) => {
//   if (!blocks || blocks.length === 0) {
//     return (
//       <div className="py-8 text-center text-foreground-muted">
//         This document is empty.
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-1">
//       {blocks.map((block) => (
//         <BlockRenderer
//           key={block.id}
//           block={block}
//           isFirst={false}
//           isLast={false}
//           onUpdate={() => {}}
//           onEnter={() => {}}
//           onBackspace={() => {}}
//           onSlashCommand={() => {}}
//           onChangeType={() => {}}
//           onDelete={() => {}}
//           onAdd={() => {}}
//           registerRef={() => {}}
//           isMenuOpen={false}
//           readOnly
//         />
//       ))}
//     </div>
//   );
// };










import { BlockRenderer } from "./BlockRenderer";

export const ReadOnlyEditor = ({ blocks }) => {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="py-8 text-center text-foreground-muted">
        This document is empty.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {blocks.map((block) => (
        <BlockRenderer
          key={block.id}
          block={block}
          isFirst={false}
          isLast={false}
          onUpdate={() => {}}
          onEnter={() => {}}
          onBackspace={() => {}}
          onSlashCommand={() => {}}
          onChangeType={() => {}}
          onDelete={() => {}}
          onAdd={() => {}}
          registerRef={() => {}}
          isMenuOpen={false}
          readOnly
        />
      ))}
    </div>
  );
};