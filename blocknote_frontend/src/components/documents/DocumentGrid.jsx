import { motion } from "framer-motion";
import { DocumentCard } from "./DocumentCard";

export const DocumentGrid = ({ documents, onDelete, onRename, onOpen }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {documents.map((doc, index) => (
        <motion.div
          key={doc.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03, duration: 0.3 }}
        >
          <DocumentCard
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