import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
} from "typeorm";
import { compareValue, hashValue } from "../../utils/bcrypt";
import { Integration } from "./integration.entity";
import { Event } from "./event.entity";
import { Meeting } from "./meeting.entity";
import { Availability } from "./availability.entity";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ unique: true, nullable: true })
  imageUrl: string;

  @OneToMany(() => Event, (event) => event.user, {
    cascade: true,
  })
  events: Event[];

  @OneToMany(() => Integration, (integration) => integration.user, {
    cascade: true,
  })
  integrations: Integration[];

  @OneToOne(() => Availability, (availability) => availability.user, {
    cascade: true,
  })
  @JoinColumn({ name: "availabilityId" })
  availability: Availability;

  @OneToMany(() => Meeting, (meeting) => meeting.user, {
    cascade: true,
  })
  meetings: Meeting[];

  // Created date column
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await hashValue(this.password);
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return await compareValue(candidatePassword, this.password);
  }

  omitPassword(): Omit<User, "password"> {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword as Omit<User, "password">;
  }
}
