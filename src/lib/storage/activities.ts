import { db } from "@/lib/db";
import { getDocumentsByActivity, deleteDocument } from "./documents";

/**
 * Delete an activity and all its associated documents
 * @param activityId - ID of the activity to delete
 * @throws Error if deletion fails
 */
export async function deleteActivityWithDocuments(
  activityId: number,
): Promise<void> {
  try {
    // Get all documents associated with this activity
    const documents = await getDocumentsByActivity(activityId);

    // Track deletion failures
    const failedDeletions: number[] = [];

    // Delete each document (this also deletes the blob)
    for (const doc of documents) {
      if (doc.id) {
        try {
          await deleteDocument(doc.id);
        } catch (docError) {
          console.error(`Failed to delete document ${doc.id}:`, docError);
          failedDeletions.push(doc.id);
        }
      }
    }

    // If some documents failed to delete, throw an error
    if (failedDeletions.length > 0) {
      throw new Error(
        `Failed to delete ${failedDeletions.length} document(s). Activity not deleted.`,
      );
    }

    // Delete the activity itself
    await db.activities.delete(activityId);
  } catch (error) {
    console.error("Error deleting activity with documents:", error);
    throw error;
  }
}

/**
 * Clean up orphaned documents (documents whose activities no longer exist)
 * @returns Number of orphaned documents deleted
 */
export async function cleanupOrphanedDocuments(): Promise<number> {
  try {
    // Get all documents
    const allDocuments = await db.documents.toArray();

    // Get all activity IDs
    const allActivities = await db.activities.toArray();
    const activityIds = new Set(
      allActivities
        .map((a) => a.id)
        .filter((id): id is number => id !== undefined),
    );

    // Find orphaned documents
    const orphanedDocuments = allDocuments.filter(
      (doc) => !activityIds.has(doc.activityId),
    );

    // Delete orphaned documents
    for (const doc of orphanedDocuments) {
      if (doc.id) {
        await deleteDocument(doc.id);
      }
    }

    return orphanedDocuments.length;
  } catch (error) {
    console.error("Error cleaning up orphaned documents:", error);
    throw error;
  }
}
