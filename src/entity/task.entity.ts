import { TASK_PRIORITY, TASK_STATUS, TASK_TYPE } from 'src/types/base.type';
import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { GlobalEntity } from './global.entity';

/**
 * Represents a Task entity stored in the database.
 * Each task is associated with a user and contains metadata for execution, retrying, and status tracking.
 */
@Entity()
export class Task extends GlobalEntity {
  /**
   * The user who created or owns the task.
   * This is a many-to-one relationship with the User entity.
   */

  constructor() {
    super();
  }
  
  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  /**
   * The type of task (e.g., EMAIL, REPORT).
   * It determines how the worker service should handle the task.
   */
  @Column({ type: 'enum', enum: TASK_TYPE, default: TASK_TYPE.EMAIL })
  type: TASK_TYPE;

  /**
   * The dynamic data needed to execute the task.
   * Stored as a JSON object — contents vary based on the task type.
   */
  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  /**
   * Current status of the task (e.g., PENDING, PROCESSING, COMPLETED, FAILED).
   * Useful for tracking and logging purposes.
   */
  @Column({ type: 'enum', enum: TASK_STATUS, default: TASK_STATUS.PENDING })
  status: TASK_STATUS;

  /**
   * Priority level of the task.
   * Typically: 1 = HIGH, 2 = MEDIUM, 3 = LOW.
   * Helps determine execution order in a busy system.
   */
  @Column({ type: 'enum', enum: TASK_PRIORITY, default: TASK_PRIORITY.LOW })
  priority: TASK_PRIORITY;

  /**
   * Number of retry attempts made after failure.
   */
  @Column({ type: 'int', default: 0 })
  retries: number;

  /**
   * Maximum number of retry attempts allowed before moving to dead-letter queue or marking failed.
   */
  @Column({ type: 'int', default: 3 })
  maxRetries: number;

  /**
   * Timestamp for when the task should be executed (future scheduling support).
   * If null, task should be executed immediately.
   */
  @Column({ type: 'timestamp', nullable: true })
  scheduledAt: Date;

  /**
   * Timestamp when the task was successfully completed.
   */
  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  /**
   * Timestamp when the task failed (after all retries, or unrecoverable error).
   */
  @Column({ type: 'timestamp', nullable: true })
  failedAt: Date;
}

  