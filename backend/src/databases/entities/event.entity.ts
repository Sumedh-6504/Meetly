import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { IntegrationAppTypeEnum } from "./integration.entity";
import { User } from "./user.entity";
import { Meeting } from "./meeting.entity";

export enum EventLocationTypeEnum {
  OUTLOOK_CALENDAR = IntegrationAppTypeEnum.OUTLOOK_CALENDAR,
  GOOGLE_MEET_AND_CALENDAR = IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR,
  ZOOM_MEETING = IntegrationAppTypeEnum.ZOOM_MEETING,
}

@Entity({ name: "events" })
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 30 })
  duration: number;

  @Column({ nullable: false })
  slug: string;

  @Column({ nullable: false, default: false })
  isPrivate: boolean;

  @Column({ type: "enum", enum: EventLocationTypeEnum })
  locationType: EventLocationTypeEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Now e are defining the relationships in the Event Entity where one user can have multiple events(meetings)
  @ManyToOne(() => User, (user) => user.events)
  user: User;
  // So we have a parallel One to many Relationship in the user-entity.ts

  @OneToMany(() => Meeting, (meeting) => meeting.event)
  meetings: Meeting[];
}
