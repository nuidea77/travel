<?php

namespace App\Filament\Resources\ItineraryDays\Pages;

use App\Filament\Resources\ItineraryDays\ItineraryDayResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListItineraryDays extends ListRecords
{
    protected static string $resource = ItineraryDayResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
