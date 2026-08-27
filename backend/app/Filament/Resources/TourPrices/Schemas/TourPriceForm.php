<?php

namespace App\Filament\Resources\TourPrices\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class TourPriceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('tour_id')
                    ->relationship('tour', 'title')
                    ->required(),
                TextInput::make('min_people')
                    ->required()
                    ->numeric(),
                TextInput::make('max_people')
                    ->required()
                    ->numeric(),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
            ]);
    }
}
