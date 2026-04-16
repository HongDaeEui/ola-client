import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ToolsModule } from './tools/tools.module';
import { MeetupsModule } from './meetups/meetups.module';
import { ResourcesModule } from './resources/resources.module';
import { PrismaModule } from './prisma/prisma.module';
import { LabsModule } from './labs/labs.module';
import { PromptsModule } from './prompts/prompts.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { SearchModule } from './search/search.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ToolsModule,
    MeetupsModule,
    ResourcesModule,
    PrismaModule,
    LabsModule,
    PromptsModule,
    PostsModule,
    LikesModule,
    BookmarksModule,
    SearchModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
