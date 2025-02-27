import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';

import { NgrxErrorEffects } from './ngrx-error.effects';
import { hot } from 'jasmine-marbles';

describe('NgrxErrorEffects', () => {
  let actions;
  let effects: NgrxErrorEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [NgrxErrorEffects, DataPersistence, provideMockActions(() => actions)],
    });

    effects = TestBed.inject(NgrxErrorEffects);
  });

  describe('someEffect', () => {
    it('should work', async () => {
      actions = hot('-a-|', { a: { type: 'LOAD_DATA' } });
      expect(true).toBeTruthy();
    });
  });
});
