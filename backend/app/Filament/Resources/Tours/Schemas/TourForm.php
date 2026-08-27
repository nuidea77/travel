<?php

namespace App\Filament\Resources\Tours\Schemas;

use App\Filament\Support\SiteImages;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class TourForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Basics')
                    ->columnSpanFull()
                    ->columns(2)
                    ->schema([
                        TextInput::make('title')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug((string) $state))),
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->helperText('Used in the URL, e.g. /tours/grand-mongolia-tour'),
                        Select::make('type')
                            ->options(['join' => 'Join a group', 'private' => 'Private'])
                            ->required()
                            ->default('join'),
                        Select::make('image')
                            ->options(SiteImages::options())
                            ->searchable()
                            ->helperText('Illustration from the frontend image set'),
                        TextInput::make('duration_days')
                            ->required()
                            ->numeric()
                            ->minValue(1),
                        TextInput::make('price_from')
                            ->required()
                            ->numeric()
                            ->prefix('$'),
                        TextInput::make('rating')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->maxValue(5)
                            ->step(0.1)
                            ->default(5),
                        TextInput::make('reviews_count')
                            ->required()
                            ->numeric()
                            ->default(0),
                        Select::make('categories')
                            ->relationship('categories', 'name')
                            ->multiple()
                            ->preload(),
                        Select::make('destinations')
                            ->relationship('destinations', 'name')
                            ->multiple()
                            ->preload(),
                    ]),

                Section::make('Content')
                    ->columnSpanFull()
                    ->schema([
                        Textarea::make('excerpt')
                            ->required()
                            ->rows(2),
                        Textarea::make('overview')
                            ->rows(6),
                        TagsInput::make('highlights')
                            ->placeholder('Add a highlight and press Enter'),
                        TagsInput::make('included')
                            ->placeholder('Add an inclusion and press Enter'),
                        TagsInput::make('excluded')
                            ->placeholder('Add an exclusion and press Enter'),
                        Repeater::make('good_to_know')
                            ->schema([
                                TextInput::make('title')->required(),
                                Textarea::make('body')->required()->rows(2),
                            ])
                            ->defaultItems(0)
                            ->collapsible(),
                    ]),

                Section::make('Visibility')
                    ->columnSpanFull()
                    ->columns(4)
                    ->schema([
                        Toggle::make('is_featured'),
                        Toggle::make('is_best_seller'),
                        Toggle::make('is_published')
                            ->default(true),
                        TextInput::make('sort_order')
                            ->numeric()
                            ->default(0),
                    ]),
            ]);
    }
}
