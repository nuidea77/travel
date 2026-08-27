<?php

namespace App\Filament\Resources\ItineraryDays\Pages;

use App\Filament\Resources\ItineraryDays\ItineraryDayResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditItineraryDay extends EditRecord
{
    protected static string $resource = ItineraryDayResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
