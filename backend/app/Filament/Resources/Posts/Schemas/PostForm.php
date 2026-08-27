<?php

namespace App\Filament\Resources\Posts\Schemas;

use App\Filament\Support\SiteImages;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class PostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('post_category_id')
                    ->relationship('category', 'name')
                    ->required()
                    ->preload(),
                Select::make('image')
                    ->options(SiteImages::options())
                    ->searchable(),
                TextInput::make('title')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug((string) $state))),
                TextInput::make('slug')
                    ->required()
                    ->unique(ignoreRecord: true),
                Textarea::make('excerpt')
                    ->required()
                    ->rows(2)
                    ->columnSpanFull(),
                RichEditor::make('body')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('author')
                    ->required()
                    ->default('Editorial Team'),
                TextInput::make('read_time')
                    ->required()
                    ->numeric()
                    ->default(5)
                    ->suffix('min'),
                DateTimePicker::make('published_at'),
                Toggle::make('is_published')
                    ->default(true),
            ]);
    }
}
