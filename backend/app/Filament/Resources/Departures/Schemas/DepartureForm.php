<?php

namespace App\Filament\Resources\Departures\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class DepartureForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('tour_id')
                    ->relationship('tour', 'title')
                    ->required(),
                DatePicker::make('start_date')
                    ->required(),
                DatePicker::make('end_date')
                    ->required(),
                TextInput::make('price')
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('seats_total')
                    ->required()
                    ->numeric()
                    ->default(16),
                TextInput::make('seats_left')
                    ->required()
                    ->numeric()
                    ->default(16),
                TextInput::make('status')
                    ->required()
                    ->default('open'),
            ]);
    }
}
