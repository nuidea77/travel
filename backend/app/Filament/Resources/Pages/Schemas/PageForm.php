<?php

namespace App\Filament\Resources\Pages\Schemas;

use App\Filament\Support\SiteImages;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class PageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required(),
                TextInput::make('slug')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->helperText('Pages used by the frontend: about-us, about-mongolia, car-rental'),
                TextInput::make('subtitle'),
                Select::make('image')
                    ->options(SiteImages::options())
                    ->searchable(),
                RichEditor::make('body')
                    ->required()
                    ->columnSpanFull(),
            ]);
    }
}
