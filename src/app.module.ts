import { Module } from '@nestjs/common';
import {WebsocketsService} from "./websockets/websockets.service";
import {WebsocketsModule} from "./websockets/websockets.module";

@Module({
  imports: [WebsocketsModule],
})
export class AppModule {
  constructor(private _websocketsService: WebsocketsService) {
    this._websocketsService.start();
  }
}
