import { Controller, Get, Post, Body } from '@nestjs/common';
import { DeckBuilderService } from './deck-builder.service';
import { CreateDeckBuilderDto } from './dto/create-deck-builder.dto';

@Controller('deck-builder')
export class DeckBuilderController {
  constructor(private readonly deckBuilderService: DeckBuilderService) {}

  @Post()
  create(@Body() createDeckBuilderDto: CreateDeckBuilderDto) {
    return this.deckBuilderService.create(createDeckBuilderDto);
  }

  @Get()
  findAll() {
    const cards = this.deckBuilderService.findAll();
    console.log(cards.length);
    return cards;
  }
}
