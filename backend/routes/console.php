<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('snippets:prune')->daily();
