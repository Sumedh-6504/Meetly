import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";

import { User } from "./user.entity";
import { DayAvailability } from "./day-availability";
@Entity()
export class Availability {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User, (user) => user.availability)
  user: User;

  @OneToMany(
    () => DayAvailability,
    (day) => day.availability,
    {
      cascade: true,
    }
  )
  days: DayAvailability[];

  @Column({ default: 30 })
  timeGap: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
