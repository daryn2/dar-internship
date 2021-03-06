import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, getRepository, MoreThan, MoreThanOrEqual, Between, getConnection, LessThanOrEqual, Connection } from "typeorm";
import { Room } from "src/models/Room";
import { Meeting } from "src/models/Meeting";
import { User } from "src/models/User";
import { timer } from "rxjs";
import { MoreThanDate } from "./utils";

@Injectable()
export class MeetingService {
    constructor(
        @InjectRepository(Meeting)
        private readonly meetingRepository: Repository<Meeting>,
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>
    ) {}
    getAll() {
        return this.meetingRepository.find();
    }
    
    
    async create(meeting: Meeting) {
        let meetingsInRange = await this.meetingRepository.find({ 
            startTime: Between(meeting.startTime, meeting.endTime)
        });
        let meetingsInRange2 = await this.meetingRepository.find({ 
            endTime: Between(meeting.startTime, meeting.endTime)
        });
        if (meetingsInRange.length > 0 || meetingsInRange2.length > 0) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'Error',
              }, HttpStatus.FORBIDDEN);
        }

        return this.meetingRepository.save(meeting);
    }
    async getByRoom(id: number) {
        let room = await this.roomRepository.findOne(id);
        const data = await this.meetingRepository.find({room: room});
        return data;
    }
}