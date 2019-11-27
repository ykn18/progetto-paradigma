import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsTweetPage } from './details-tweet.page';

describe('DetailsTweetPage', () => {
  let component: DetailsTweetPage;
  let fixture: ComponentFixture<DetailsTweetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsTweetPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsTweetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
