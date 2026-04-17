import { motion } from "framer-motion";
import { DocumentListItem } from "./DocumentListItem";

export const DocumentList = ({ documents, onDelete, onRename, onOpen }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-3"
    >
      {documents.map((doc, index) => (
        <motion.div
          key={doc.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.02, duration: 0.3 }}
        >
          <DocumentListItem
            document={doc}
            onDelete={onDelete}
            onRename={onRename}
            onOpen={onOpen}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};