<?php

namespace App\Filament\Resources\ItineraryDays;

use App\Filament\Resources\ItineraryDays\Pages\CreateItineraryDay;
use App\Filament\Resources\ItineraryDays\Pages\EditItineraryDay;
use App\Filament\Resources\ItineraryDays\Pages\ListItineraryDays;
use App\Filament\Resources\ItineraryDays\Schemas\ItineraryDayForm;
use App\Filament\Resources\ItineraryDays\Tables\ItineraryDaysTable;
use App\Models\ItineraryDay;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ItineraryDayResource extends Resource
{
    protected static ?string $model = ItineraryDay::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return ItineraryDayForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ItineraryDaysTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListItineraryDays::route('/'),
            'create' => CreateItineraryDay::route('/create'),
            'edit' => EditItineraryDay::route('/{record}/edit'),
        ];
    }
}
