import { db } from "@/lib/db";
import {
  AssessmentProgress,
  AssessmentResult,
  AssessmentHistoryEntry,
  AssessmentResponses,
  Recommendation,
} from "@/types/assessment";

/**
 * Save or update assessment progress
 * @param userId - User profile ID
 * @param currentStep - Current step in the assessment
 * @param responses - Partial responses collected so far
 * @returns The saved progress record with ID
 */
export async function saveAssessmentProgress(
  userId: string,
  currentStep: number,
  responses: Partial<AssessmentResponses>,
): Promise<AssessmentProgress> {
  try {
    // Check if there's existing incomplete progress
    const existing = await db.assessmentProgress
      .where("userId")
      .equals(userId)
      .and((p) => !p.isComplete)
      .first();

    const progress: AssessmentProgress = {
      userId,
      startedAt: existing?.startedAt || new Date(),
      lastUpdatedAt: new Date(),
      currentStep,
      responses,
      isComplete: false,
    };

    if (existing?.id) {
      // Update existing progress
      await db.assessmentProgress.update(existing.id, {
        lastUpdatedAt: progress.lastUpdatedAt,
        currentStep: progress.currentStep,
        responses: progress.responses,
      });
      return { ...progress, id: existing.id };
    } else {
      // Create new progress
      const id = await db.assessmentProgress.add(progress);
      return { ...progress, id };
    }
  } catch (error) {
    console.error("Error saving assessment progress:", error);
    throw new Error("Failed to save assessment progress");
  }
}

/**
 * Get the current assessment progress for a user
 * @param userId - User profile ID
 * @returns The current progress record, or undefined if none exists
 */
export async function getAssessmentProgress(
  userId: string,
): Promise<AssessmentProgress | undefined> {
  try {
    const progress = await db.assessmentProgress
      .where("userId")
      .equals(userId)
      .and((p) => !p.isComplete)
      .first();

    return progress;
  } catch (error) {
    console.error("Error getting assessment progress:", error);
    throw new Error("Failed to retrieve assessment progress");
  }
}

/**
 * Mark assessment progress as complete and delete it
 * @param progressId - ID of the progress record
 */
export async function completeAssessmentProgress(
  progressId: number,
): Promise<void> {
  try {
    await db.assessmentProgress.delete(progressId);
  } catch (error) {
    console.error("Error completing assessment progress:", error);
    throw new Error("Failed to complete assessment progress");
  }
}

/**
 * Save a completed assessment result
 * @param userId - User profile ID
 * @param responses - Complete assessment responses
 * @param recommendation - Calculated recommendation
 * @returns The saved result record with ID
 */
export async function saveAssessmentResult(
  userId: string,
  responses: AssessmentResponses,
  recommendation: Recommendation,
): Promise<AssessmentResult> {
  try {
    // Archive any existing result to history first
    const existingResult = await getLatestAssessmentResult(userId);
    if (existingResult?.id) {
      await archiveAssessmentResult(existingResult.id);
    }

    const result: AssessmentResult = {
      userId,
      completedAt: new Date(),
      responses,
      recommendation,
      version: 1, // Current assessment logic version
    };

    const id = await db.assessmentResults.add(result);
    return { ...result, id };
  } catch (error) {
    console.error("Error saving assessment result:", error);
    throw new Error("Failed to save assessment result");
  }
}

/**
 * Get the most recent assessment result for a user
 * @param userId - User profile ID
 * @returns The latest result record, or undefined if none exists
 */
export async function getLatestAssessmentResult(
  userId: string,
): Promise<AssessmentResult | undefined> {
  try {
    const results = await db.assessmentResults
      .where("userId")
      .equals(userId)
      .reverse()
      .sortBy("completedAt");

    return results[0];
  } catch (error) {
    console.error("Error getting latest assessment result:", error);
    throw new Error("Failed to retrieve assessment result");
  }
}

/**
 * Archive an assessment result to history
 * @param resultId - ID of the result to archive
 */
export async function archiveAssessmentResult(resultId: number): Promise<void> {
  try {
    const result = await db.assessmentResults.get(resultId);

    if (!result) {
      throw new Error("Assessment result not found");
    }

    // Add to history
    const historyEntry: AssessmentHistoryEntry = {
      userId: result.userId,
      completedAt: result.completedAt,
      exemptionStatus: result.recommendation.primaryMethod === "exemption",
      recommendedMethod: result.recommendation.primaryMethod,
    };

    await db.assessmentHistory.add(historyEntry);

    // Remove from current results
    await db.assessmentResults.delete(resultId);
  } catch (error) {
    console.error("Error archiving assessment result:", error);
    throw new Error("Failed to archive assessment result");
  }
}

/**
 * Get all historical assessment entries for a user
 * @param userId - User profile ID
 * @returns Array of historical entries, sorted by date (newest first)
 */
export async function getAssessmentHistory(
  userId: string,
): Promise<AssessmentHistoryEntry[]> {
  try {
    const history = await db.assessmentHistory
      .where("userId")
      .equals(userId)
      .reverse()
      .sortBy("completedAt");

    return history;
  } catch (error) {
    console.error("Error getting assessment history:", error);
    throw new Error("Failed to retrieve assessment history");
  }
}

/**
 * Delete assessment progress (for starting fresh)
 * @param userId - User profile ID
 */
export async function deleteAssessmentProgress(userId: string): Promise<void> {
  try {
    const progress = await getAssessmentProgress(userId);
    if (progress?.id) {
      await db.assessmentProgress.delete(progress.id);
    }
  } catch (error) {
    console.error("Error deleting assessment progress:", error);
    throw new Error("Failed to delete assessment progress");
  }
}
